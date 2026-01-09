const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// ▼▼▼ 여기에 본인의 실제 API 키를 입력하세요 ▼▼▼
const API_KEY = "AIzaSyB0Q16_nWlDgV0XNrKpr6r3RExPh7aQqik"; 
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const genAI = new GoogleGenerativeAI(API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function runTest() {
  console.log("🔮 풍수지리 전문가 AI를 호출합니다...");

  // 모델 선택 (Gemini 1.5 Flash가 빠르고 무료 티어 제공)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    너는 30년 경력의 풍수지리 전문가야. 
    이 사진 속 공간을 분석하고, [JSON 형식]으로만 답해줘.
    
    필수 포함 항목:
    1. summary: 한 줄 총평
    2. score: 100점 만점 점수
    3. current_status: good_points(리스트), bad_points(리스트-issue/solution)
    4. recommendations: 추천 아이템(item_name, reason, search_keyword)

    사용자 정보: 1983년생 남자, '화(Fire)' 기운 부족.
  `;

  try {
    // 이미지 로드 (폴더에 room.jpg가 있어야 함)
    const imagePart = fileToGenerativePart("room.jpg", "image/jpeg");

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log("✅ 분석 완료! 결과는 아래와 같습니다:\n");
    console.log(text); 

  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
  }
}

runTest();