import  React from 'react';

import Button from "../../../../shared/components/FormElements/Button/Button";
import Item from "../../../../shared/components/UIElement/Item/Item";
import ListItem from "../../../../shared/components/UIElement/List/ListItem/ListItem";

const BookingItem = (props) => {


    return (
        <ListItem>

            <Item info={props.title}
                  actions={
                      <React.Fragment>
                          <Button clear>
                              VIEW DETAILS
                          </Button>
                          <Button danger onClick={() => props.cancel(props.booking)}>
                              CANCEL
                          </Button>
                      </React.Fragment>
                  }
            />
        </ListItem>
    )
}


export default BookingItem;
