from django.contrib import admin

# Register your models here.
from .models import *

class RoomAdmin(admin.ModelAdmin):
    list_display =['uuid' , 'client'  , 'url' , 'created_at' ,'status']

admin.site.register(Room, RoomAdmin)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('body',)

admin.site.register(Message, MessageAdmin)

