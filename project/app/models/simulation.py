from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models

class Simulation(models.Model):
    name = models.CharField(max_length=40, blank=False, validators=[RegexValidator(r"^[A-Za-z0-9_ ]+")], default="unnamed_simulation")
    
    domain_min_x = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    domain_min_y = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    domain_min_z = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    domain_max_x = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    domain_max_y = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    domain_max_z = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    
    divisions_x = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=10)
    divisions_y = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=10)
    divisions_z = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], default=10)
    
    spawn_min_x = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    spawn_min_y = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    spawn_min_z = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=-100)
    spawn_max_x = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    spawn_max_y = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    spawn_max_z = models.FloatField(validators=[MinValueValidator(-1000.0), MaxValueValidator(1000.0)], default=100)
    
    separation = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=5)
    alignment = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=5)
    cohesion = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)], default=5)
    
    def get_domain(self) -> tuple[float, float, float]:
        return {
            "domain_min": (self.domain_min_x, self.domain_min_y, self.domain_min_z),
            "domain_max": (self.domain_max_x, self.domain_max_y, self.domain_max_z)
        }

    def get_partitions(self) -> tuple[float, float, float]:
        return [self.divisions_x, self.partitionsY, self.partitionsZ]
    
    def serialize(self) -> dict:
        return {
            "name": self.name,
            
            "domain_min_x": self.domain_min_x,
            "domain_min_y": self.domain_min_y,
            "domain_min_z": self.domain_min_z,
            "domain_max_x": self.domain_max_x,
            "domain_max_y": self.domain_max_y,
            "domain_max_z": self.domain_max_z,
            
            "divisions_x": self.divisions_x,
            "divisions_y": self.divisions_y,
            "divisions_z": self.divisions_z,
            
            "spawn_min_x": self.spawn_min_x,
            "spawn_min_y": self.spawn_min_y,
            "spawn_min_z": self.spawn_min_z,
            "spawn_max_x": self.spawn_max_x,
            "spawn_max_y": self.spawn_max_y,
            "spawn_max_z": self.spawn_max_z,
            
            "separation": self.separation,
            "alignment": self.alignment,
            "cohesion": self.cohesion,
        }

    class Meta:
        abstract = False