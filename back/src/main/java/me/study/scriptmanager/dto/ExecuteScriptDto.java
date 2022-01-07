package me.study.scriptmanager.dto;

import java.util.Map;

public record ExecuteScriptDto(Long id, Map<String, Object> params) {
}
