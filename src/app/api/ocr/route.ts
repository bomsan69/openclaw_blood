import { NextRequest, NextResponse } from 'next/server';
import { performOCR } from '@/lib/ocrHelper';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'image is required' },
        { status: 400 }
      );
    }

    // data:image/...;base64, 접두사 제거
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const result = await performOCR(base64);

    return NextResponse.json({
      success: true,
      high: result.high,
      low: result.low,
      plus: result.pulse
    });
  } catch (error) {
    console.error('OCR error:', error);
    return NextResponse.json(
      { error: 'OCR 인식 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
