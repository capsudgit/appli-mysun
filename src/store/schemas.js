import { schema } from 'normalizr'

let schemas = {
    user: new schema.Entity('users', {}),
    quotation: new schema.Entity('quotations', {}),
}

schemas.user.define({})
schemas.quotation.define({})

export default schemas