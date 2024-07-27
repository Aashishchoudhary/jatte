from django.db import models

# Create your models here.
from account.models import User
from django.db.models.signals import pre_delete
from django.dispatch import receiver


class Message(models.Model):
    body = models.TextField()
    sent_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, blank=True, null=True, on_delete=models.CASCADE)

    class Meta:
        ordering = ('created_at',)

    def __str__(self):
        return f'{self.sent_by}'


class Room(models.Model):
    WAITING = 'waiting'
    ACTIVE = 'active'
    CLOSED = 'closed'

    CHOICES_STATUS = (
        (WAITING, 'waiting'),
        (ACTIVE, 'active'),
        (CLOSED, 'closed')
    )

    uuid = models.CharField(max_length=255)
    client = models.CharField(max_length=255)
    agent = models.ForeignKey(
        User, related_name='rooms', blank=True, null=True, on_delete=models.SET_NULL)
    messages = models.ManyToManyField(Message, blank=True )
    url = models.CharField(max_length=255, blank=True, null=True)
    status=models.CharField(max_length=20 , choices=CHOICES_STATUS  , default=WAITING)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f' {self.uuid}'










# signal  to delete message of a perticular room
@receiver(pre_delete , sender=Room)
def delete_message( instance , **kwargs):  
 
    message = instance.messages.all()
    
    for x in message:
        
        x.delete()
       