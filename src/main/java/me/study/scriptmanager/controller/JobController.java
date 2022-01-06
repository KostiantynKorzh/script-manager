package me.study.scriptmanager.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.study.scriptmanager.dto.ScriptCreationDto;
import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService scriptService;

    public JobController(JobService scriptService) {
        this.scriptService = scriptService;
    }

    @GetMapping("/{id}")
    public Job getScript(@PathVariable Long id) throws IOException {
        return scriptService.getJob(id);
    }

    @PostMapping()
    public String createScript(@RequestBody JsonNode requestBody) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<Object> scripts = new ArrayList<>();
        String jobName = requestBody.get("name").asText();
        JsonNode scriptsNode = requestBody.get("steps");
        for (JsonNode jsonNode : scriptsNode) {
            if (jsonNode.isObject()) {
                ScriptCreationDto scriptToCreate = mapper.treeToValue(jsonNode, ScriptCreationDto.class);
                scripts.add(scriptToCreate);
            } else {
                scripts.add(jsonNode.asLong());
            }
        }
        scriptService.createJob(jobName, scripts);
        return "Creating Job...";
    }

}
