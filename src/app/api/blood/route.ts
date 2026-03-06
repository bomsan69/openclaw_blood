import { NextRequest, NextResponse } from 'next/server';
import { saveBloodPressure, getBloodPressureRecords, deleteBloodPressure } from '@/lib/db';

// POST: 혈압 데이터 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, high, low, plus, measuredAt, period } = body;
    
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
      measuredAt || new Date().toISOString().split('T')[0],
      period || '아침'
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

// DELETE: 혈압 데이터 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      );
    }
    
    const result = deleteBloodPressure(Number(id), Number(userId));
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Record not found or unauthorized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blood pressure:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
