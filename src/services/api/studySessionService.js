import { toast } from 'react-toastify'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const studySessionService = {
  async getAll() {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "cards_studied" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "user_id" } }
        ]
      };

      const response = await apperClient.fetchRecords('study_session', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      toast.error("Failed to fetch study sessions");
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "cards_studied" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "user_id" } }
        ]
      };

      const response = await apperClient.getRecordById('study_session', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching study session with ID ${id}:`, error);
      return null;
    }
  },

  async getRecentSessions(limit = 10) {
    try {
      await delay(250)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "cards_studied" } },
          { field: { Name: "accuracy" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [
          {
            fieldName: "start_time",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('study_session', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent study sessions:", error);
      return [];
    }
  },

  async create(sessionData) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: sessionData.Name || "Study Session",
            Tags: sessionData.Tags || "",
            Owner: sessionData.Owner || null,
            start_time: sessionData.start_time || new Date().toISOString(),
            end_time: sessionData.end_time || null,
            cards_studied: sessionData.cards_studied || 0,
            accuracy: sessionData.accuracy || 0,
            user_id: sessionData.user_id || null
          }
        ]
      };

      const response = await apperClient.createRecord('study_session', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success("Study session created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating study session:", error);
      toast.error("Failed to create study session");
      return null;
    }
  },

  async update(id, updates) {
    try {
      await delay(300)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
      if (updates.start_time !== undefined) updateData.start_time = updates.start_time;
      if (updates.end_time !== undefined) updateData.end_time = updates.end_time;
      if (updates.cards_studied !== undefined) updateData.cards_studied = updates.cards_studied;
      if (updates.accuracy !== undefined) updateData.accuracy = updates.accuracy;
      if (updates.user_id !== undefined) updateData.user_id = updates.user_id;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('study_session', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success("Study session updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating study session:", error);
      toast.error("Failed to update study session");
      return null;
    }
  },

  async endSession(id, finalStats) {
    try {
      await delay(200)
      const updates = {
        end_time: new Date().toISOString(),
        ...finalStats
      };

      return await this.update(id, updates);
    } catch (error) {
      console.error("Error ending study session:", error);
      toast.error("Failed to end study session");
      return null;
    }
  },

  async getWeeklyStats() {
    try {
      await delay(300)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "cards_studied" } },
          { field: { Name: "accuracy" } }
        ],
        where: [
          {
            FieldName: "start_time",
            Operator: "GreaterThanOrEqualTo",
            Values: [oneWeekAgo.toISOString()],
            Include: true
          }
        ]
      };

      const response = await apperClient.fetchRecords('study_session', params);

      if (!response.success) {
        console.error(response.message);
        return {
          sessionsCount: 0,
          totalCards: 0,
          totalTimeMinutes: 0,
          averageAccuracy: 0
        };
      }

      const recentSessions = response.data || [];
      const totalCards = recentSessions.reduce((sum, s) => sum + (s.cards_studied || 0), 0);
      const totalTime = recentSessions.reduce((sum, s) => {
        if (s.end_time && s.start_time) {
          return sum + (new Date(s.end_time) - new Date(s.start_time));
        }
        return sum;
      }, 0);

      return {
        sessionsCount: recentSessions.length,
        totalCards,
        totalTimeMinutes: Math.round(totalTime / (1000 * 60)),
        averageAccuracy: recentSessions.length > 0 
          ? recentSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / recentSessions.length
          : 0
      };
    } catch (error) {
      console.error("Error getting weekly stats:", error);
      return {
        sessionsCount: 0,
        totalCards: 0,
        totalTimeMinutes: 0,
        averageAccuracy: 0
      };
    }
  },

  async delete(id) {
    try {
      await delay(200)
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('study_session', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success("Study session deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting study session:", error);
      toast.error("Failed to delete study session");
      return false;
    }
  }
}