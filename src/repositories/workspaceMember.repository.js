import WorkspaceMember from "../models/workspaceMembers.model.js"

class WorkspaceMemberRepository {

    async create(user_id, workspace_id, rol) {
        return await WorkspaceMember.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            rol: rol
        })
    }

    async getById(member_id) {
        return await WorkspaceMember.findById(member_id)
    }

    async updateById(member_id, update_data) {
        return await WorkspaceMember.findByIdAndUpdate(member_id, update_data)
    }

    async deleteById(member_id) {
        return await WorkspaceMember.findByIdAndDelete(member_id)
    }

    async getByWorkspaceId(workspace_id) {
        
        const result = await WorkspaceMember
            .find({ fk_workspace_id: workspace_id })

            .populate(
                'fk_user_id', 'nombre email'
            )

        const members_mapped = result.map(
            (member) => new MemberWorkspaceWithUserInfo(member)
        )
        return members_mapped
    }

    async getByUserId(user_id) {
        
    }

}

const workspaceMemberRepository = new WorkspaceMemberRepository()

export default workspaceMemberRepository

class MemberWorkspaceWithUserInfo {
    constructor(
        raw_member
    ) {
        this.user_id = raw_member._id
        this.member_fk_workspace_id = raw_member.fk_workspace_id,
            this.member_rol = raw_member.rol,
            this.member_fecha_creacion = raw_member.fecha_creacion,
            this.user_id = raw_member.fk_user_id._id,
            this.user_nombre = raw_member.fk_user_id.nombre,
            this.user_email = raw_member.fk_user_id.email
    }
}