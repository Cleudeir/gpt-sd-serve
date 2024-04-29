const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  content: string;
};

export const requestSD = async ({
  content,
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  const url = "http://127.0.0.1:7860/sdapi/v1/txt2img";
  const body = {
    prompt: `${content}`,
  };
  console.log("body: ", url, JSON.stringify(body, null, 2));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (result.error) {
      console.error("Error fetching response:", result.error);
      return undefined;
    }
    const { images } = result;
    const [image] = images;

    const min = Math.floor((Date.now() - time) / 1000 / 60);
    const seg = Math.floor((Date.now() - time) / 1000) % 60;
    console.log("end time: ", min, "min", seg, "seg");
    return image;
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }
};
