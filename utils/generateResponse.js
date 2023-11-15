const axios = require('axios');
const { modelData } = require("../config.json");
const apiKey = process.env.segmindApiKey;

async function generateImage(model, prompt, steps, seed , negative_prompt) {
    let scheduler = modelData[model]?.scheduler ?? "dpmpp_sde_ancestral";
    const url = modelData[model].apiUrl;
    const data = {
        prompt,
        negative_prompt,
        samples: "1",
        scheduler,
        num_inference_steps: steps,
        guidance_scale: "7.5",
        seed,
        img_width: "768",
        img_height: "768"
    };
    const response = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        responseType: 'arraybuffer',
    }).then((response) => {
        return {
            success: true,
            response
        }
    }).catch((error) => {
        return {
            success: false,
            response: error
        }

    });
    return response;
}



module.exports = { generateImage };