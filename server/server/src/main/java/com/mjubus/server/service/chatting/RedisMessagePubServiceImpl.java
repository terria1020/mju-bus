package com.mjubus.server.service.chatting;

import com.mjubus.server.repository.ChattingRoomRepository;
import com.mjubus.server.vo.ChattingMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RedisMessagePubServiceImpl implements RedisMessagePubService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private final RedisMessageSubService redisMessageSubService;
    private final ChattingRoomRepository chattingRoomRepository;


    @Autowired
    public RedisMessagePubServiceImpl(RedisTemplate<String, Object> redisTemplate, RedisMessageListenerContainer redisMessageListenerContainer, RedisMessageSubService redisMessageSubService, ChattingRoomRepository chattingRoomRepository) {
        this.redisTemplate = redisTemplate;
        this.redisMessageListenerContainer = redisMessageListenerContainer;
        this.redisMessageSubService = redisMessageSubService;
        this.chattingRoomRepository = chattingRoomRepository;
    }

    @Override
    public void publish(ChattingMessage chattingMessage) {
        ChannelTopic topic = new ChannelTopic(chattingMessage.getRoomId());
        chattingRoomRepository.newChattingRoom(chattingMessage.getRoomId(), topic);
        redisMessageListenerContainer.addMessageListener(redisMessageSubService, topic);
        redisTemplate.convertAndSend(topic.getTopic(), chattingMessage);
    }
}