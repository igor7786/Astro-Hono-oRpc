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
await rustfsClient.send(new CreateBucketCommand({ Bucket: BUCKET }));
console.log('✅ Bucket created:', BUCKET);

// 2. List buckets
const { Buckets } = await rustfsClient.send(new ListBucketsCommand({}));
console.log(
  '✅ Buckets:',
  Buckets?.map((b) => b.Name)
);

// 3. Upload object
await rustfsClient.send(
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: 'hello.txt',
    Body: 'Hello from RustFS!',
    ContentType: 'text/plain',
  })
);
console.log('✅ Object uploaded');

// 4. Download object
const { Body } = await rustfsClient.send(
  new GetObjectCommand({
    Bucket: BUCKET,
    Key: 'hello.txt',
  })
);
const text = await new Response(Body as ReadableStream).text();
console.log('✅ Object content:', text);

// 5. Delete object
await rustfsClient.send(
  new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: 'hello.txt',
  })
);
console.log('✅ Object deleted');

// 6. Delete bucket
await rustfsClient.send(new DeleteBucketCommand({ Bucket: BUCKET }));
console.log('✅ Bucket deleted');
