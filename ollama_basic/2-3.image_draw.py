# text to image : diffusers + CUDA(GPU)로 로컬에서 실행 (Linux/WSL2 지원)
# 이전에는 Ollama의 x/flux2-klein(Mac 전용, MLX 런타임 필요)을 사용했으나
# Linux 환경에서 동작하도록 stabilityai/sdxl-turbo(diffusers)로 교체함

import torch
from pathlib import Path
from datetime import datetime
from diffusers import AutoPipelineForText2Image


MODEL_NAME = "stabilityai/sdxl-turbo"
OUTPUT_DIR = Path("img_output")


def load_pipeline(model: str = MODEL_NAME):
    """diffusers 파이프라인을 로드하고 사용 가능한 경우 GPU로 옮긴다."""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32

    pipeline = AutoPipelineForText2Image.from_pretrained(
        model,
        torch_dtype=dtype,
        variant="fp16" if device == "cuda" else None,
    )
    pipeline = pipeline.to(device)

    return pipeline


def generate_image(
    prompt: str,
    pipeline=None,
    model: str = MODEL_NAME,
    output_dir: Path = OUTPUT_DIR,
) -> Path | None:
    """sdxl-turbo로 이미지를 생성하고 output_dir에 저장한다."""

    output_dir.mkdir(parents=True, exist_ok=True)

    print("이미지 생성 요청 중...")
    print("모델:", model)
    print("프롬프트:", prompt)

    if pipeline is None:
        pipeline = load_pipeline(model)

    # sdxl-turbo는 guidance_scale=0.0, 1~4 step으로 빠르게 생성하도록 설계됨
    result = pipeline(
        prompt=prompt,
        num_inference_steps=2,
        guidance_scale=0.0,
    )
    image = result.images[0]

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = output_dir / f"image_{timestamp}.png"
    image.save(output_path)

    print("\n이미지 생성 완료:")
    print(output_path)

    return output_path


if __name__ == "__main__":
    prompt = (
        # "A clean modern todo app landing page, "
        # "soft green background, minimal UI, "
        # "readable text saying 'TODO APP', "
        # "flat design, high quality, 1024x1024"
        "happy pikachu sitting on a grassy field, smiling and waving, "
        "sunny day, bright colors, cartoon style, "
        "flat design, high quality, 1024x1024"
    )

    generated_path = generate_image(prompt)

    if generated_path:
        print("\n저장 위치:", generated_path.resolve())
