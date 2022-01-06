package me.study.scriptmanager.dto;

import java.util.List;

public record JobCreationDto(String name, List<Long> steps) {
}
