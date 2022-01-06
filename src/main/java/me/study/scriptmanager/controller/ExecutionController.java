package me.study.scriptmanager.controller;

import me.study.scriptmanager.dto.ExecuteScriptDto;
import me.study.scriptmanager.service.ExecutionService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/executions")
public class ExecutionController {

    private final ExecutionService scriptService;

    public ExecutionController(ExecutionService scriptService) {
        this.scriptService = scriptService;
    }

    @PostMapping()
    public String executeScript(@RequestBody ExecuteScriptDto executeScriptDto) throws IOException {
        scriptService.executeJob(13L);
        return "Executing job...";
    }

}
