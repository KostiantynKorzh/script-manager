package me.study.scriptmanager.controller;

import me.study.scriptmanager.dto.ExecuteScriptDto;
import me.study.scriptmanager.service.ExecutionService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/executions")
public class ExecutionController {

    private final ExecutionService scriptService;

    public ExecutionController(ExecutionService scriptService) {
        this.scriptService = scriptService;
    }

    @PostMapping()
    public String executeScript(@RequestBody ExecuteScriptDto executeScriptDto) throws IOException {
        return scriptService.executeJob(executeScriptDto.id(), executeScriptDto.params());
    }

}
