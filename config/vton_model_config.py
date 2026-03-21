from dataclasses import dataclass

@dataclass
class FashnVtonModelConfig:
    weights_dir: str = "./weights/fashn_vton_weights"
    num_timesteps: int = 30
    num_samples: int = 1