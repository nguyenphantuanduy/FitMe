from models.vton_model import FashnVtonModel
from models.frontback_model import EfficientNetb1
from config.vton_model_config import FashnVtonModelConfig
from config.frontback_model_config import EfficientNetb1Config

# Create model
vton_config = FashnVtonModelConfig()
vton_model = FashnVtonModel(vton_config)

frontback_config = EfficientNetb1Config()
frontback_model = EfficientNetb1(frontback_config)

