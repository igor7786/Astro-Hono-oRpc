import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { rustfsClient } from '@/lib/s3/rustfs';

const BUCKET = 'test-bucket';

export async function s3Testings() {
  // 1. Create bucket
  try {
    await rustfsClient.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log('✅ Bucket created:', BUCKET);
  } catch (err) {
    console.error('❌ Error creating bucket:', err instanceof Error ? err.message : err);
  }

  // 2. List buckets
  try {
    const { Buckets } = await rustfsClient.send(new ListBucketsCommand({}));
    console.log(
      '✅ Buckets:',
      Buckets?.map((b) => b.Name)
    );
  } catch (err) {
    console.error('❌ Error listing buckets:', err instanceof Error ? err.message : err);
  }

  // 3. Upload object
  try {
    await rustfsClient.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: 'hello.txt',
        Body: 'Hello from RustFS!',
        ContentType: 'text/plain',
      })
    );
    console.log('✅ Object uploaded');
  } catch (err) {
    console.error('❌ Error uploading object:', err instanceof Error ? err.message : err);
  }

  // 4. Download object
  try {
    const { Body } = await rustfsClient.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: 'hello.txt',
      })
    );
    const text = await new Response(Body as ReadableStream).text();
    console.log('✅ Object content:', text);
  } catch (err) {
    console.error('❌ Error downloading object:', err instanceof Error ? err.message : err);
  }

  // 5. Delete object
  try {
    await rustfsClient.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: 'hello.txt',
      })
    );
    console.log('✅ Object deleted');
  } catch (err) {
    console.error('❌ Error deleting object:', err instanceof Error ? err.message : err);
  }

  // 6. Upload file
  try {
    const file = Bun.file('./src/lib/s3/1.txt');
    const upload = new Upload({
      client: rustfsClient,
      params: {
        Bucket: 'test-bucket',
        Key: 'test/1.txt',
        Body: file.stream(),
        ContentType: file.type,
        ContentLength: file.size, // fixes total showing 0.00MB
      },
      queueSize: 4, // parallel parts
      partSize: 1024 * 1024 * 5, // 5MB per part (minimum)
    });

    upload.on('httpUploadProgress', (progress: any) => {
      const loaded = ((progress.loaded ?? 0) / 1024 / 1024).toFixed(2);
      const total = ((progress.total ?? 0) / 1024 / 1024).toFixed(2);
      console.log(`⬆️ Uploaded ${loaded}MB / ${total}MB`);
    });

    await upload.done();
    console.log('✅ Large file uploaded');
  } catch (err) {
    console.error('❌ Error uploading large file:', err instanceof Error ? err.message : err);
  }

  // 7. Download file
  try {
    const response = await rustfsClient.send(
      new GetObjectCommand({
        Bucket: 'test-bucket',
        Key: 'test/1.txt',
      })
    );

    if (response.Body) {
      const text = await new Response(response.Body as ReadableStream).text();
      console.log('✅ Object content:', text.trim().substring(0, 100)); // Print first 100 characters
    }
  } catch (err) {
    console.error('❌ Error downloading object:', err instanceof Error ? err.message : err);
  }

  // 8. List buckets
  try {
    const { Buckets } = await rustfsClient.send(new ListBucketsCommand({}));
    console.log(
      '✅ Buckets:',
      Buckets?.map((b) => b.Name)
    );
  } catch (err) {
    console.error('❌ Error listing buckets:', err instanceof Error ? err.message : err);
  }

  // 9. Delete bucket
  // Delete all objects then bucket
  try {
    const { Contents } = await rustfsClient.send(new ListObjectsV2Command({ Bucket: BUCKET }));

    if (Contents?.length) {
      await rustfsClient.send(
        new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: {
            Objects: Contents.map(({ Key }) => ({ Key: Key! })),
          },
        })
      );
      console.log('✅ All objects deleted');
    }

    await rustfsClient.send(new DeleteBucketCommand({ Bucket: BUCKET }));
    console.log('✅ Bucket deleted');
  } catch (err) {
    console.error('❌ Error deleting bucket:', err instanceof Error ? err.message : err);
  }
}

await s3Testings();
