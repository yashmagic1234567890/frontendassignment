import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../services/api';
import TicketCard from './TicketCard';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');

  useEffect(() => {
    async function getTickets() {
      const data = await fetchTickets();
      setTickets(data.tickets);
    }
    getTickets();
  }, []);

  const groupTickets = (tickets, groupBy) => {
    return tickets.reduce((acc, ticket) => {
      const key = ticket[groupBy];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});
  };

  const sortTickets = (tickets, sortBy) => {
    return [...tickets].sort((a, b) => {
      if (sortBy === 'priority') return b.priority - a.priority;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
    });
  };

  const groupedTickets = groupTickets(tickets, grouping);
  
  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <label>
          Group By:
          <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </label>
        <label>
          Order By:
          <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      <div className="kanban-columns">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <h3>{group}</h3>
            {sortTickets(groupedTickets[group], ordering).map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
