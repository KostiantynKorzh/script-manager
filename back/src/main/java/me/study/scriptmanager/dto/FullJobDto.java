package me.study.scriptmanager.dto;

import me.study.scriptmanager.model.Script;

import java.util.List;

public record FullJobDto(Long id, String name, List<Script> scripts, String params) {
}
