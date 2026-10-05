import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const hf = new InferenceClient(process.env.HF_TOKEN);

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* =========================================================
   LOCAL FALLBACK PROMPT ENHANCER
   Used when Gemini is unavailable
========================================================= */

function localEnhancePrompt(userPrompt: string) {
  const prompt = userPrompt.trim();

  const lower = prompt.toLowerCase();

  let extraDetails = "";

  // GTA V
  if (
    lower.includes("gta v") ||
    lower.includes("gta 5") ||
    lower.includes("grand theft auto")
  ) {
    extraDetails += `
The scene must clearly represent Grand Theft Auto V.
Show recognizable Grand Theft Auto V / Los Santos-style gameplay
rather than a generic video game.
`;
  }

  // PlayStation 5
  if (
    lower.includes("ps5") ||
    lower.includes("playstation 5") ||
    lower.includes("playstation")
  ) {
    extraDetails += `
Show the subject actually playing on a PlayStation 5.
Use a recognizable PlayStation 5 DualSense wireless controller.
`;
  }

  // Minecraft
  if (lower.includes("minecraft")) {
    extraDetails += `
Clearly represent Minecraft with its recognizable block-based
visual world and gameplay elements.
`;
  }

  // Fortnite
  if (lower.includes("fortnite")) {
    extraDetails += `
Clearly represent Fortnite with recognizable Fortnite-style
gameplay and environment.
`;
  }

  // PUBG
  if (lower.includes("pubg")) {
    extraDetails += `
Clearly represent PUBG gameplay with a recognizable
battle-royale environment.
`;
  }

  // Roblox
  if (lower.includes("roblox")) {
    extraDetails += `
Clearly represent Roblox with recognizable Roblox-style
characters and environment.
`;
  }

  return `
Create a highly detailed photorealistic cinematic image based on this
exact user request:

"${prompt}"

IMPORTANT:
- Preserve the user's exact subject and intent.
- Do NOT replace specific games, brands, products, characters, places,
  consoles or objects with generic alternatives.
- If the user mentions a specific game, show that specific game.
- If the user mentions a specific console, show that specific console.
- Make the requested action obvious.
- Do not invent major story elements that were not requested.
- Use realistic human anatomy, realistic hands, realistic skin,
  realistic hair and natural proportions.
- Make the environment logically match the request.
- Use realistic lighting and believable materials.
- Cinematic composition.
- Professional photography quality.
- Sharp subject with natural depth of field.
- High detail and realistic textures.
- Photorealistic unless the user explicitly requests another style.

${extraDetails}

The final image should look like a professionally photographed,
cinematic real-world scene while preserving all important details
from the original request.
`;
}

/* =========================================================
   GEMINI PROMPT ENHANCER
========================================================= */

async function enhancePromptWithGemini(userPrompt: string) {
  const response = await gemini.models.generateContent({
    model: "gemini-3.8-flash",

    contents: userPrompt,

    config: {
      systemInstruction: `
You are an expert AI image prompt engineer.

Your job is to transform a short user's image request into a detailed,
high-quality prompt for a photorealistic image generation model.

CRITICAL RULES:

1. NEVER change the user's main intent.

2. NEVER replace specific things with generic things.

Examples:

"GTA V" must remain "Grand Theft Auto V".

"PlayStation 5" must remain "PlayStation 5".

"Spider-Man" must remain Spider-Man.

"Ferrari" must remain Ferrari.

"New York" must remain New York.

3. Preserve all specific:
- games
- movies
- characters
- brands
- products
- locations
- vehicles
- devices
- consoles
- clothing
- objects

4. Make the requested action visually obvious.

5. Add useful visual information:
- environment
- composition
- camera angle
- lighting
- realistic materials
- realistic skin
- realistic hair
- realistic hands
- realistic anatomy
- depth of field
- cinematic atmosphere

6. Do NOT invent major objects, characters or events that change
the meaning of the user's request.

7. Default to photorealistic cinematic realism unless the user
explicitly asks for anime, cartoon, illustration, 3D, painting,
pixel art or another style.

8. If the user asks for someone playing a specific game on a
specific console, make BOTH the game and console visually important.

9. For gaming scenes, make the gameplay screen clearly visible
whenever appropriate.

10. Return ONLY the final image-generation prompt.
Do not explain anything.
Do not use headings.
Do not say "here is your prompt".
`,

      temperature: 0.2,
      maxOutputTokens: 700,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty prompt");
  }

  return text;
}

/* =========================================================
   MAIN API
========================================================= */

export async function POST(request: Request) {
  try {
    /* -----------------------------------------------------
       AUTHENTICATION
    ----------------------------------------------------- */

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    /* -----------------------------------------------------
       GET REQUEST DATA
    ----------------------------------------------------- */

    const body = await request.json();

    const userPrompt = body.prompt?.trim();

    if (!userPrompt) {
      return NextResponse.json(
        { error: "Please enter a prompt." },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       CHECK ENVIRONMENT
    ----------------------------------------------------- */

    if (!process.env.HF_TOKEN) {
      return NextResponse.json(
        { error: "Hugging Face token is missing." },
        { status: 500 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase service role key is missing." },
        { status: 500 }
      );
    }

    /* -----------------------------------------------------
       CHECK USER CREDITS
    ----------------------------------------------------- */

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("credits, plan")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);

      return NextResponse.json(
        { error: "Could not load your account." },
        { status: 500 }
      );
    }

    if (profile.credits <= 0) {
      return NextResponse.json(
        {
          error:
            "You have no credits left. Please upgrade your plan.",
        },
        { status: 402 }
      );
    }

    /* -----------------------------------------------------
       ENHANCE PROMPT
    ----------------------------------------------------- */

    let finalPrompt = "";

    try {
      console.log("Original prompt:", userPrompt);

      // First attempt
      try {
        finalPrompt = await enhancePromptWithGemini(userPrompt);
      } catch (firstError) {
        console.warn(
          "Gemini first attempt failed:",
          firstError
        );

        // Small delay before retry
        await new Promise((resolve) =>
          setTimeout(resolve, 1200)
        );

        // Second attempt
        try {
          finalPrompt = await enhancePromptWithGemini(userPrompt);
        } catch (secondError) {
          console.warn(
            "Gemini second attempt failed:",
            secondError
          );

          // Local fallback
          finalPrompt = localEnhancePrompt(userPrompt);
        }
      }

      console.log("Enhanced prompt:", finalPrompt);
    } catch (enhanceError) {
      console.error(
        "Prompt enhancement failed:",
        enhanceError
      );

      // Absolute fallback
      finalPrompt = localEnhancePrompt(userPrompt);
    }

    /* -----------------------------------------------------
       GENERATE IMAGE WITH FLUX
    ----------------------------------------------------- */

    console.log("Generating image with FLUX...");

    const image = await hf.textToImage(
      {
        provider: "fal-ai",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: finalPrompt,
      },
      {
        outputType: "dataUrl",
      }
    );

    /* -----------------------------------------------------
       DEDUCT ONE CREDIT
    ----------------------------------------------------- */

    const { data: creditUsed, error: creditError } =
      await supabaseAdmin.rpc("use_credit", {
        user_id: user.id,
      });

    if (creditError) {
      console.error(
        "Credit deduction error:",
        creditError
      );

      return NextResponse.json(
        {
          error:
            "Image generated, but credit processing failed.",
        },
        { status: 500 }
      );
    }

    if (!creditUsed) {
      return NextResponse.json(
        {
          error:
            "Could not use your credit. Please try again.",
        },
        { status: 402 }
      );
    }

    /* -----------------------------------------------------
       SUCCESS
    ----------------------------------------------------- */

    return NextResponse.json({
      image,
      creditUsed: true,
      enhancedPrompt: finalPrompt,
    });
  } catch (error: any) {
    console.error("Generation error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Something went wrong while generating the image.",
      },
      { status: 500 }
    );
  }
}