package me.study.scriptmanager.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.study.scriptmanager.dto.FullJobDto;
import me.study.scriptmanager.dto.ScriptCreationDto;
import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.repository.JobRepository;
import me.study.scriptmanager.repository.ScriptRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class JobService {

    private final ScriptRepository scriptRepository;
    private final JobRepository jobRepository;

    private final ExecutionService executionService;

    public JobService(ScriptRepository scriptRepository, JobRepository jobRepository, ExecutionService executionService) {
        this.scriptRepository = scriptRepository;
        this.jobRepository = jobRepository;
        this.executionService = executionService;
    }

    public FullJobDto getJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() ->
                new RuntimeException("No such job with id: " + id)
        );

        List<Script> scripts = executionService.createListOfScripts(executionService.convertScriptIdsFromStringToList(job.getScriptsIds()));
        return new FullJobDto(job.getId(), job.getName(), scripts, job.getParams());
    }

    public List<FullJobDto> getAllJob() {
        List<Job> jobs = jobRepository.findAll();

        return jobs.stream().map(job -> {
            List<Script> scripts = executionService.createListOfScripts(executionService.convertScriptIdsFromStringToList(job.getScriptsIds()));
            return new FullJobDto(job.getId(), job.getName(), scripts, job.getParams());
        }).toList();
    }

    public Job createJob(String name, List<Object> scripts, String params) {
        List<Long> scriptsIds = createScriptsOrGetIdAndCreateScriptsIdsList(scripts);

        return jobRepository.save(Job.builder()
                .name(name)
                .scriptsIds(convertScriptsIdsToCommaSeparatedString(scriptsIds))
                .params(params)
                .build());
    }

    private List<Long> createScriptsOrGetIdAndCreateScriptsIdsList(List<Object> scripts) {
        List<Long> scriptsIds = new LinkedList<>();
        scripts.forEach(script -> {
            if (script instanceof ScriptCreationDto) {
                Script createdScript = null;
                try {
                    createdScript = createScriptFromCreationDto((ScriptCreationDto) script);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                if (createdScript != null) {
                    scriptsIds.add(createdScript.getId());
                }
            } else {
                scriptsIds.add((Long) script);
            }
        });

        return scriptsIds;
    }

    private Script createScriptFromCreationDto(ScriptCreationDto script) throws JsonProcessingException {
        return scriptRepository.save(Script.builder()
                .name(script.name())
                .body(script.scriptBody())
                .params(String.valueOf(new ObjectMapper().writeValueAsString(((ScriptCreationDto) script).params())))
                .build());
    }

    private String convertScriptsIdsToCommaSeparatedString(List<Long> scriptsIds) {
        return String.join(",",
                        scriptsIds.toString()
                                .replace("[", "")
                                .replace("]", ""))
                .replaceAll("\\s*", "");
    }

}
