
export default async function handler(req, res) {
  const version = req.body.version;
  console.log("height: " + req.body.height);
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version: version,

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt: req.body.prompt, 
        negative_prompt: req.body.negative_prompt, 
        image: req.body.image, 
        mask: req.body.mask, 
        width: req.body.width, 
        height: req.body.height, 
        num_outouts: req.body.num_outouts, 
        scheduler: req.body.scheduler, 
        num_inference_steps: req.body.num_inference_steps,
         guidance_scale: req.body.guidance_scale, 
         prompt_strength: req.body.prompt_strength, 
         seed: req.body.seed, 
         refine: req.body.refine, 
         high_noise_frac: req.body.high_noise_frac, 
         refine_steps: req.body.refine_steps },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}