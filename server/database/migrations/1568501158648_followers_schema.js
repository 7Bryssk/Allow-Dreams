'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowersSchema extends Schema {
  up() {
    this.create('followers', (table) => {
      table.increments()
      table.integer('user_id_follower').unsigned().references('id').inTable('users')
      table.integer('user_id_followed_by').unsigned().references('id').inTable('users')
      table.enum('status', ['request', 'deny', 'accept', 'block', 'unfollow'])
      table.timestamps()
    })
  }

  down() {
    this.drop('followers')
  }
}

module.exports = FollowersSchema
