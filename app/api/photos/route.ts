import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('fileUrl' as string) || '';
  if (fileUrl) {
    await del(fileUrl);
    return NextResponse.json({ message: 'File deleted' });
  } else {
    return NextResponse.json({
      message: 'url file is missing',
    });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName' as string) || '';
  const folderName = searchParams.get('folderName' as string) || '';

  //validate type of file
  if (!fileName.match(/\.(jpg|jpeg|png)$/i)) {
    return NextResponse.json({ message: 'Invalid file type' });
  }

  if (fileName && folderName && request.body) {
    const blob = await put(`${folderName}/${fileName}`, request.body, {
      access: 'public',
    });
    return NextResponse.json({ blob });
  } else {
    return NextResponse.json({
      message: 'Name or folder or body is missing',
    });
  }
}
