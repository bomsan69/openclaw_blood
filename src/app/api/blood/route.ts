import { NextRequest, NextResponse } from 'next/server';
import { saveBloodPressure, getBloodPressureRecords } from '@/lib/db';

// POST: 혈압 데이터 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, high, low, plus, measuredAt } = body;
    
    // 필수 필드 검증
    if (!userId || high === undefined || low === undefined || plus === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, high, low, plus' },
        { status: 400 }
      );
    }
    
    const result = saveBloodPressure(
      userId,
      Number(high),
      Number(low),
      Number(plus),
      measuredAt || new Date().toISOString().split('T')[0]
    );
    
    return NextResponse.json({
      success: true,
      id: result.id
    });
  } catch (error) {
    console.error('Error saving blood pressure:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: 혈압 데이터 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const records = getBloodPressureRecords(
      Number(userId),
      startDate,
      endDate,
      page,
      limit
    );
    
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching blood pressure:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
