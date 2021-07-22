import { reactive } from "@vue/reactivity";
import useDocument from "./useDocument";

const emails = reactive(new Set());

const useEmailSelection = () => {
  const handleClick = email => {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };
  const clear = () => {
    emails.clear();
  };

  const addMultiple = newEmails => {
    newEmails.forEach(email => {
      emails.add(email);
    });
  };

  const forSelected = fn => {
    emails.forEach(async email => {
      fn(email);
      const { updateDoc } = useDocument("emails", email.id);
      await updateDoc({ ...email });
    });
  };

  const markRead = () => {
    forSelected(email => (email.read = true));
    clear();
  };
  const markUnread = () => {
    forSelected(email => (email.read = false));
    clear();
  };

  const archive = () => {
    forSelected(email => (email.archived = true));
    clear();
  };
  const unarchive = () => {
    forSelected(email => (email.archived = false));
    clear();
  };
  const remove = () => {
    emails.forEach(async email => {
      const { deleteDoc } = useDocument("emails", email.id);
      await deleteDoc();
      clear();
    });
  };

  return {
    emails,
    handleClick,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive,
    unarchive,
    remove
  };
};

export default useEmailSelection;
