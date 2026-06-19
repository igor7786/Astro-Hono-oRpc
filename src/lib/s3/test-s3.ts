import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

import { rustfsClient } from '@/lib/s3/rustfs';

const BUCKET = 'test-bucket';

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

// 6. List buckets
try {
  const { Buckets } = await rustfsClient.send(new ListBucketsCommand({}));
  console.log(
    '✅ Buckets:',
    Buckets?.map((b) => b.Name)
  );
} catch (err) {
  console.error('❌ Error listing buckets:', err instanceof Error ? err.message : err);
}

// 7. Delete bucket
try {
  await rustfsClient.send(new DeleteBucketCommand({ Bucket: BUCKET }));
  console.log('✅ Bucket deleted');
} catch (err) {
  console.error('❌ Error deleting bucket:', err instanceof Error ? err.message : err);
}
