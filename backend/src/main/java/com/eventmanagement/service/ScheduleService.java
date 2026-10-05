package com.eventmanagement.service;

import com.eventmanagement.dto.ScheduleRequest;
import com.eventmanagement.dto.ScheduleResponse;
import com.eventmanagement.exception.BadRequestException;
import com.eventmanagement.exception.ResourceNotFoundException;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Schedule;
import com.eventmanagement.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final EventService eventService;

    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository, EventService eventService) {
        this.scheduleRepository = scheduleRepository;
        this.eventService = eventService;
    }

    public ScheduleResponse addSession(ScheduleRequest request) {
        validateTimes(request.getStartTime(), request.getEndTime());
        Event event = eventService.getEventEntity(request.getEventId());

        Schedule schedule = new Schedule();
        schedule.setEvent(event);
        applyRequest(schedule, request);

        return toResponse(scheduleRepository.save(schedule));
    }

    public ScheduleResponse updateSession(Long id, ScheduleRequest request) {
        validateTimes(request.getStartTime(), request.getEndTime());
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule session not found with id: " + id));

        applyRequest(schedule, request);
        return toResponse(scheduleRepository.save(schedule));
    }

    public void deleteSession(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule session not found with id: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    public List<ScheduleResponse> getScheduleForEvent(Long eventId) {
        return scheduleRepository.findByEventIdOrderByStartTimeAsc(eventId)
                .stream().map(this::toResponse).toList();
    }

    private void validateTimes(java.time.LocalTime start, java.time.LocalTime end) {
        if (start != null && end != null && !end.isAfter(start)) {
            throw new BadRequestException("Session end time must be after start time");
        }
    }

    private void applyRequest(Schedule schedule, ScheduleRequest request) {
        schedule.setSessionName(request.getSessionName());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setDescription(request.getDescription());
    }

    private ScheduleResponse toResponse(Schedule schedule) {
        ScheduleResponse dto = new ScheduleResponse();
        dto.setId(schedule.getId());
        dto.setEventId(schedule.getEvent().getId());
        dto.setSessionName(schedule.getSessionName());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setDescription(schedule.getDescription());
        return dto;
    }
}
