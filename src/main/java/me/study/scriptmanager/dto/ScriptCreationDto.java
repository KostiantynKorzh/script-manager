package me.study.scriptmanager.dto;

import java.util.Map;

public record ScriptCreationDto(String name, String scriptBody, Map<String, Object> params) {
}
