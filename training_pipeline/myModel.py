from abc import ABC, abstractmethod

class myModel(ABC):

    def __init__(self):
        pass

    @abstractmethod
    def training(self):
        pass