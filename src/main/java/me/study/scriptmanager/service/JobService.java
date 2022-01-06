package me.study.scriptmanager.service;

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

    public Job getJob(Long id) throws IOException {
        return jobRepository.findById(id).orElseThrow(() ->
                new RuntimeException("No such job with id: " + id)
        );
    }

    public void createJob(String name, List<Object> scripts) throws IOException {
        List<Long> scriptsIds = new LinkedList<>();
        scripts.forEach(script -> {
            if (script instanceof ScriptCreationDto) {
                Script createdScript = scriptRepository.save(Script.builder()
                        .name(((ScriptCreationDto) script).name())
                        .body(((ScriptCreationDto) script).scriptBody())
                        .build());
                scriptsIds.add(createdScript.getId());
            } else {
                scriptsIds.add((Long) script);
            }
        });

        Job job = jobRepository.save(Job.builder()
                .name(name)
                .scriptsIds(String.join(",",
                                scriptsIds.toString()
                                        .replace("[", "")
                                        .replace("]", ""))
                        .replaceAll("\\s*", "")
                )
                .build());

        System.out.println(job);

//        Path fileName = Path.of(formatFilenameWithShellExtension(BASE_DIR + "\\" + scriptToCreate.name()));
//        Files.writeString(fileName, scriptToCreate.scriptBody());
    }

}
