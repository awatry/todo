package net.watrys.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.watrys.todo.model.ListItem;

@Repository
public interface ListItemRepository extends JpaRepository<ListItem, Long> {

}
