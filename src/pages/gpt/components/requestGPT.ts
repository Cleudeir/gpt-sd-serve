const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  content: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  type?: number;
};

function extractCodeFromTripleBackticks(inputString: string) {
  let regex = /```(javascript|jsx|ts|html|^\s)([\s\S]+?)```/g;
  let result = "";
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    result += match[2];
  }
  if (result === "") {
    result = inputString;
  }
  if (result.includes("```")) {
    result = extractCodeFromTriple(inputString);
  }

  return result;
}

function extractCodeFromTriple(inputString: string) {
  let regex = /``` ```/g;
  let result = "";
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    result += match[2];
  }
  if (result === "") {
    result = inputString;
  }
  return result;
}

export const requestGPT = async ({
  content,
  model = "llama3",
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  const url = "http://127.0.0.1:11434/api/generate";
  const body = {
    model,
    prompt: `${content}`,
    stream: false,
    options: {
      main_gpu: 1,
      //num_batch: 4,
      //num_gqa: 4,
      // num_gpu: 48,
      // num_thread: 4,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (result.error) {
      console.error("Error fetching response:", result.error);
      return undefined;
    }
    const { response: output } = result;

    const min = Math.floor((Date.now() - time) / 1000 / 60);
    const seg = Math.floor((Date.now() - time) / 1000) % 60;
    console.log("end time: ", min, "min", seg, "seg");

    return extractCodeFromTripleBackticks(output);
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }
};
