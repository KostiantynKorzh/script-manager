package me.study.scriptmanager.model;

import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "users")
public class User extends BaseModel{

    private String username;

    private String password;

}
