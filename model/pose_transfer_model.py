from abc import ABC, abstractmethod
from config.pose_transfer_model_config import Pose2PoseModelConfig
from PIL import Image
from pose2pose.pose_transfer.api import Pose2Pose


class PoseTransferModel(ABC):
    @abstractmethod
    def __init__(self, config):
        pass

    @abstractmethod
    def pose_transfer(
        self,
        condition_img: Image.Image,
        reference_img: Image.Image
    ) -> Image.Image:
        pass


class Pose2PoseModel(PoseTransferModel):

    def __init__(self, config: Pose2PoseModelConfig):
        self.pretrained = config.pretrained
        self.ignore_cache = config.ignore_cache
        self.checkpoint = config.checkpoint

        self.model = Pose2Pose(
            pretrained=self.pretrained,
            ignore_cache=self.ignore_cache,
            checkpoint=self.checkpoint
        )

    def pose_transfer(
        self,
        condition_img: Image.Image,
        reference_img: Image.Image
    ) -> Image.Image:

        # Gọi model pose transfer
        generated = self.model.transfer_as(
            condition_img,
            reference_img
        )

        return generated