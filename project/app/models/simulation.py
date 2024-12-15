from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models

class Simulation(models.Model):
    name = models.CharField(max_length=40, blank=False, validators=[RegexValidator(r"^[A-Za-z0-9_ ]+")], default="unnamed_simulation")
    sizeX = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=0)
    sizeY = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=0)
    sizeZ = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=0)
    partitionsX = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    partitionsY = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    partitionsZ = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    separation = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    alignment = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    cohesion = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=0)
    
    def get_size(self) -> tuple[float, float, float]:
        return [self.sizeX, self.sizeY, self.sizeZ]

    def get_partitions(self) -> tuple[float, float, float]:
        return [self.partitionsX, self.partitionsY, self.partitionsZ]
    
    def serialize(self) -> dict:
        return {
            "name": self.name,
            "sizeX": self.sizeX,
            "sizeY": self.sizeY,
            "sizeZ": self.sizeZ,
            "partitionsX": self.partitionsX,
            "partitionsY": self.partitionsY,
            "partitionsZ": self.partitionsZ,
            "separation": self.separation,
            "alignment": self.alignment,
            "cohesion": self.cohesion,
        }

    class Meta:
        abstract = False