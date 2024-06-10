package ru.kata.spring.boot_security.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Enumerated(EnumType.STRING)
    private RoleUser roleUser;

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private Set<User> users;


    public Role() {
    }

    public Role(String roleName) {
        this.roleUser = RoleUser.valueOf(roleName);
    }

    public Role(RoleUser roleUser) {
        this.roleUser = roleUser;
    }



    @Override
    public String getAuthority() {
        return "ROLE_" + roleUser.name();
    }

    public String getRoleName() {
        return roleUser.name();
    }
    public RoleUser getRoleUser() {
        return roleUser;
    }

    public void setRoleUser(RoleUser roleUser) {
        this.roleUser = roleUser;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleUser=" + roleUser +
                '}';
    }
}
