package net.watrys.todo.controller;

//import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.RepresentationModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping
    RepresentationModel<?> index() {
        RepresentationModel<?> rootModel = new RepresentationModel<>();
        return rootModel;
    }
}
