import { NextRequest, NextResponse } from 'next/server';

// APIエンドポイントのメイン処理
export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_URL || '';
  const apiKey = process.env.API_KEY || '';  
  
  // NextRequest の formData() メソッドを使用してフォームデータを取得
  try {
  const formData = await req.formData(); //アップロードされた画像を取得
  const file = formData.get('file') as File | null;
    if (!file) {
      throw new Error('ファイルが見つかりません');
    }

    // 外部APIにリクエストを送信
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
      },
      body: formData,
    });

    if (response.ok) {
      const apiResult = await response.json();
      const box = apiResult.result?.[0].box;
      return NextResponse.json({ message: '画像送信成功', box });
    } else {
      return NextResponse.json({ message: '不明なエラー', error: response.statusText }, { status: response.status });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'サーバーエラー', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'サーバーエラー: 不明なエラー' }, { status: 500 });
    }
  }
}