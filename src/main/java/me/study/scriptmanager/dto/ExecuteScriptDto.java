package me.study.scriptmanager.dto;

import java.util.List;

public record ExecuteScriptDto(String script, List<String> args) {
}
