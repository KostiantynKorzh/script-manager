package me.study.scriptmanager.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import me.study.scriptmanager.dto.ScriptCreationDto;
import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.repository.JobRepository;
import me.study.scriptmanager.repository.ScriptRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

@Service
public class JobService {

    private final ScriptRepository scriptRepository;
    private final JobRepository jobRepository;

    public JobService(ScriptRepository scriptRepository, JobRepository jobRepository) {
        this.scriptRepository = scriptRepository;
        this.jobRepository = jobRepository;
    }

    public Job getJob(Long id) {
        return jobRepository.findById(id).orElseThrow(() ->
                new RuntimeException("No such job with id: " + id)
        );
    }

    public Job createJob(String name, List<Object> scripts, String params) throws IOException {
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
