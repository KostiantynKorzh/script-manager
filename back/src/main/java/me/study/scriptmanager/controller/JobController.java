package me.study.scriptmanager.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.study.scriptmanager.dto.FullJobDto;
import me.study.scriptmanager.dto.ScriptCreationDto;
import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService scriptService;
    private final ObjectMapper mapper;

    public JobController(JobService scriptService, ObjectMapper mapper) {
        this.scriptService = scriptService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<FullJobDto> getAllJobs() {
        return scriptService.getAllJob();
    }

    @GetMapping("/{id}")
    public FullJobDto getJob(@PathVariable Long id) {
        return scriptService.getJob(id);
    }

    @PostMapping()
    public Job createJob(@RequestBody JsonNode requestBody) throws IOException {
        List<Object> scripts = new ArrayList<>();

        String jobName = requestBody.get("name").asText();
        JsonNode paramsNode = requestBody.get("params");
        JsonNode scriptsNode = requestBody.get("steps");

        for (JsonNode jsonNode : scriptsNode) {
            if (jsonNode.isObject()) {
                ScriptCreationDto scriptToCreate = mapper.treeToValue(jsonNode, ScriptCreationDto.class);
                scripts.add(scriptToCreate);
            } else {
                scripts.add(jsonNode.asLong());
            }
        }
        return scriptService.createJob(jobName, scripts, paramsNode.toString());
    }

}
