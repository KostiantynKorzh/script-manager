package me.study.scriptmanager.security;

import lombok.Builder;
import lombok.Data;
import me.study.scriptmanager.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@Builder

public class UserDetailsAuth implements UserDetails {

    private Long id;
    private Collection<? extends GrantedAuthority> authorities;
    private String password;
    private String username;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;
    private boolean enabled;

    public static UserDetailsAuth build(User user) {

        return UserDetailsAuth.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .build();

    }

}
