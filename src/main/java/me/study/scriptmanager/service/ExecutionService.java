package me.study.scriptmanager.service;

import me.study.scriptmanager.model.Job;
import me.study.scriptmanager.model.Script;
import me.study.scriptmanager.repository.JobRepository;
import me.study.scriptmanager.repository.ScriptRepository;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

import static me.study.scriptmanager.utils.Constants.BASE_DIR;
import static me.study.scriptmanager.utils.Constants.BASH_PATH;
import static me.study.scriptmanager.utils.FileUtils.formatFilenameWithShellExtension;

@Service
public class ExecutionService {

    private final JobRepository jobRepository;
    private final ScriptRepository scriptRepository;

    public ExecutionService(JobRepository jobRepository, ScriptRepository scriptRepository) {
        this.jobRepository = jobRepository;
        this.scriptRepository = scriptRepository;
    }

    public String executeScriptFromString(String script, List<String> args) throws IOException {
//        script = formatFilenameWithShellExtension(script);
//        String fullScriptPath = BASE_DIR + "\\" + script;
//        System.out.println("Full Script Path: " + fullScriptPath);

        List<String> resultCommandList = new ArrayList<>();
        String[] command = {BASH_PATH, "-c", script};
        Collections.addAll(resultCommandList, command);
        Collections.addAll(resultCommandList, args.toArray(new String[0]));

        StringBuilder fullCommand = new StringBuilder();
        for (String commandPart : resultCommandList) {
            fullCommand.append(commandPart).append(" ");
        }

        System.out.println("Full Command: " + fullCommand);

        Process process = Runtime.getRuntime().exec(resultCommandList.toArray(new String[0]));
        BufferedReader reader = new BufferedReader(new InputStreamReader(
                process.getInputStream()));
        StringBuilder scriptOutput = new StringBuilder();
        String s = "";
        while ((s = reader.readLine()) != null) {
            scriptOutput.append(s).append('\n');
        }
        System.out.println("Output: " + scriptOutput);
        return scriptOutput.toString();
    }

    public void executeJob(Long id) {
        Job job = jobRepository.getById(id);
        List<Long> scriptsIds = Arrays.stream(job.getScriptsIds().split(",")).map(Long::new).toList();
        List<Script> scripts = new LinkedList<>();
        scriptsIds.forEach(scriptId -> {
            Script script = scriptRepository.findById(scriptId).orElseGet(() -> {
                System.out.println("Can't find script with id: " + scriptId);
                return null;
            });
            if (script != null) {
                scripts.add(script);
            }
        });
        System.out.println(scriptsIds);
        System.out.println(scripts);
        scripts.forEach(script -> {
            try {
                executeScriptFromString(script.getBody(), new LinkedList<>());
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

}
