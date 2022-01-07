package me.study.scriptmanager.dto;

import java.util.List;
import java.util.Map;

public record JobCreationDto(String name, List<Long> steps, Map<String, Object> params) {
}
