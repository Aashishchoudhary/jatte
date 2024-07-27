from django.urls import path

from .views import *

urlpatterns=[
    path('api/create-room/<str:uuid>/' , create_room , name='create-room'),
    path('chat-admin/add-user/' , add_user , name='add-user'),
    path('chat-admin/user/<uuid:uuid>' ,user_details,name='user_details'),
    path('chat-admin/user/<uuid:uuid>/edit/' ,edit_user , name='edit_user'),
    path('chat-admin/' ,admin , name='admin' ),
    path('chat-admin/<str:uuid>' ,room , name='room' ),
    path('chat-admin/<str:uuid>/delete/' ,delete_room , name='delete_room'),
 
]