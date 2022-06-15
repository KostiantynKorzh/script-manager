package me.study.scriptmanager.utils;

public class FileUtils {

    public static String formatFilenameWithShellExtension(String filename){
        if (!filename.contains(".sh")) {
            filename = filename.replace(".", "") + ".sh";
        }

        return filename;
    }

}
