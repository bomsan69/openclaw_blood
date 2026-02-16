import OpenAI from "openai";

export async function performOCR(base64Image: string) {
    const openai = new OpenAI();

  try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text",
                 text: "Extract the systolic, diastolic, and pulse readings displayed on a digital blood pressure monitor. The values are shown on the screen, where the systolic (SYS) is the upper number, the diastolic (DIA) is the middle number, and the pulse (PULSE) is the bottom number. Output the values in the format: 'SYS, DIA, PULSE'. Do not add any additional text" 
             },
              {
                type: "image_url",
                image_url: {
                  "url":  `data:image/png;base64,${base64Image}`,
                },
              }
            ],
          },
        ],
      });
    
    
    const result = response.choices[0].message.content as string;
    
    const [high, low, pulse] = result.split(','); // 예시 응답 형식에 따라 값을 추출

    return { high: high.trim(), low: low.trim(), pulse: pulse.trim() };
  }
   catch (error) {
   console.error( error);
    throw new Error('OCR 인식 중 오류 발생');
  }
}