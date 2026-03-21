from dataclasses import dataclass
from typing import Optional


@dataclass
class Pose2PoseModelConfig:
    pretrained: bool = True
    ignore_cache: bool = False
    checkpoint: Optional[str] = None